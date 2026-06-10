const Post = require('../models/Post');
const PostReaction = require('../models/PostReaction');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../config/constants');

const createPost = async (userId, postData) => {
    const post = await Post.create({
        ...postData,
        author: userId,
    });

    return Post.findById(post._id).populate('author', 'name email avatar role');
};

const getPosts = async ({
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    search,
    type,
    status,
    course,
    userRole,
}) => {
    const query = {};

    if (type) query.type = type;
    if (status) {
        query.status = status;
    } else {
        query.status = 'published';
    }
    if (course) query.course = course;
    if (userRole) query.targetRoles = { $in: [userRole] };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
        ];
    }

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
    const skip = (safePage - 1) * safeLimit;

    const [posts, total] = await Promise.all([
        Post.find(query)
            .populate('author', 'name email avatar role')
            .populate('course', 'code name')
            .skip(skip)
            .limit(safeLimit)
            .sort({ publishedAt: -1 })
            .lean(),
        Post.countDocuments(query),
    ]);

    const reactionCounts = await PostReaction.aggregate([
        { $match: { post: { $in: posts.map((p) => p._id) } } },
        { $group: { _id: { post: '$post', type: '$type' }, count: { $sum: 1 } } },
    ]);

    const countMap = {};
    for (const rc of reactionCounts) {
        const pid = rc._id.post.toString();
        if (!countMap[pid]) countMap[pid] = {};
        countMap[pid][rc._id.type] = rc.count;
    }

    const enriched = posts.map((p) => ({
        ...p,
        reactions: countMap[p._id.toString()] || {},
    }));

    return {
        posts: enriched,
        pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
};

const getPostById = async (postId) => {
    const post = await Post.findById(postId)
        .populate('author', 'name email avatar role')
        .populate('course', 'code name');

    if (!post) {
        throw ApiError.notFound('Không tìm thấy bài viết');
    }

    const reactions = await PostReaction.find({ post: postId }).lean();
    const reactionCounts = {};
    const userReactions = {};

    for (const r of reactions) {
        reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
    }

    return { ...post.toObject(), reactions: reactionCounts, userReactions };
};

const updatePost = async (postId, userId, userRole, updateData) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw ApiError.notFound('Không tìm thấy bài viết');
    }

    if (userRole !== 'admin' && post.author.toString() !== userId) {
        throw ApiError.forbidden('Chỉ tác giả hoặc quản trị viên mới có thể sửa');
    }

    const { title, content, status, targetRoles, attachments, course } = updateData;
    const allowedUpdates = {};

    if (title !== undefined) allowedUpdates.title = title;
    if (content !== undefined) allowedUpdates.content = content;
    if (status !== undefined) allowedUpdates.status = status;
    if (targetRoles !== undefined) allowedUpdates.targetRoles = targetRoles;
    if (attachments !== undefined) allowedUpdates.attachments = attachments;
    if (course !== undefined) allowedUpdates.course = course;

    return Post.findByIdAndUpdate(postId, allowedUpdates, { new: true, runValidators: true })
        .populate('author', 'name email avatar role')
        .populate('course', 'code name');
};

const deletePost = async (postId, userId, userRole) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw ApiError.notFound('Không tìm thấy bài viết');
    }

    if (userRole !== 'admin' && post.author.toString() !== userId) {
        throw ApiError.forbidden('Chỉ tác giả hoặc quản trị viên mới có thể xóa');
    }

    await Promise.all([
        Post.findByIdAndDelete(postId),
        PostReaction.deleteMany({ post: postId }),
    ]);
};

const toggleReaction = async (postId, userId, reactionType) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw ApiError.notFound('Không tìm thấy bài viết');
    }

    const existing = await PostReaction.findOne({ post: postId, user: userId, type: reactionType });

    if (existing) {
        await PostReaction.findByIdAndDelete(existing._id);
        return { toggled: false, type: reactionType };
    }

    await PostReaction.create({ post: postId, user: userId, type: reactionType });
    return { toggled: true, type: reactionType };
};

const getUserReactions = async (postId, userId) => {
    return PostReaction.find({ post: postId, user: userId }).lean();
};

const moderatePost = async (postId, status) => {
    const post = await Post.findByIdAndUpdate(
        postId,
        { status },
        { new: true, runValidators: true }
    ).populate('author', 'name email avatar role');

    if (!post) {
        throw ApiError.notFound('Không tìm thấy bài viết');
    }

    return post;
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleReaction,
    getUserReactions,
    moderatePost,
};
