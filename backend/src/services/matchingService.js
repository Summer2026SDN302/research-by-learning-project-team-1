const User = require('../models/User');
const Team = require('../models/Team');
const ApiError = require('../utils/apiError');
const { PAGINATION, TEAM_STATUS } = require('../config/constants');

const STOPWORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'i',
    'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they', 'them',
    'this', 'that', 'these', 'those', 'not', 'no', 'so', 'if', 'then',
    'than', 'too', 'very', 'just', 'about', 'also', 'more', 'some', 'any',
    'all', 'each', 'every', 'both', 'few', 'most', 'other', 'into', 'over',
    'such', 'only', 'own', 'same', 'as', 'up', 'out', 'off',
]);

const WEIGHTS = {
    GPA: 0.15,
    SKILLS: 0.30,
    INTERESTS: 0.25,
    MAJOR: 0.15,
    DESCRIPTION: 0.15,
};

const getKeywords = (text) => {
    if (!text || typeof text !== 'string') return [];

    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 1 && !STOPWORDS.has(word));

    return [...new Set(words)];
};

const jaccardSimilarity = (arr1, arr2) => {
    if (!arr1?.length || !arr2?.length) return 0;

    const set1 = new Set(arr1.map((item) => String(item).toLowerCase()));
    const set2 = new Set(arr2.map((item) => String(item).toLowerCase()));

    const intersection = [...set1].filter((item) => set2.has(item));
    const union = new Set([...set1, ...set2]);

    return union.size === 0 ? 0 : intersection.length / union.size;
};

const computeScore = (userProfile, targetProfile) => {
    const gpaDiff = Math.abs((userProfile.gpa ?? 0) - (targetProfile.gpa ?? 0));
    const gpaScore = 1 - gpaDiff / 4;

    const skillsScore = jaccardSimilarity(
        userProfile.skills ?? [],
        targetProfile.skills ?? []
    );

    const interestsScore = jaccardSimilarity(
        userProfile.interests ?? [],
        targetProfile.interests ?? []
    );

    const majorScore =
        userProfile.major && targetProfile.major &&
        userProfile.major.toLowerCase() === targetProfile.major.toLowerCase()
            ? 1
            : 0.3;

    const userKeywords = getKeywords(userProfile.description ?? '');
    const targetKeywords = getKeywords(targetProfile.description ?? '');
    const descriptionScore = jaccardSimilarity(userKeywords, targetKeywords);

    const totalScore =
        gpaScore * WEIGHTS.GPA +
        skillsScore * WEIGHTS.SKILLS +
        interestsScore * WEIGHTS.INTERESTS +
        majorScore * WEIGHTS.MAJOR +
        descriptionScore * WEIGHTS.DESCRIPTION;

    return {
        total: Math.round(totalScore * 100 * 100) / 100,
        breakdown: {
            gpa: Math.round(gpaScore * 100 * 100) / 100,
            skills: Math.round(skillsScore * 100 * 100) / 100,
            interests: Math.round(interestsScore * 100 * 100) / 100,
            major: Math.round(majorScore * 100 * 100) / 100,
            description: Math.round(descriptionScore * 100 * 100) / 100,
        },
    };
};

const computeTeamScore = (userProfile, team) => {
    const skillsScore = jaccardSimilarity(
        userProfile.skills ?? [],
        team.requiredSkills ?? []
    );

    const interestsScore = jaccardSimilarity(
        userProfile.interests ?? [],
        team.tags ?? []
    );

    const userKeywords = getKeywords(userProfile.description ?? '');
    const teamKeywords = getKeywords(team.description ?? '');
    const descriptionScore = jaccardSimilarity(userKeywords, teamKeywords);

    const totalScore =
        skillsScore * 0.45 +
        interestsScore * 0.30 +
        descriptionScore * 0.25;

    return {
        total: Math.round(totalScore * 100 * 100) / 100,
        breakdown: {
            skills: Math.round(skillsScore * 100 * 100) / 100,
            interests: Math.round(interestsScore * 100 * 100) / 100,
            description: Math.round(descriptionScore * 100 * 100) / 100,
        },
    };
};

const getRecommendedTeams = async (userId, {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
} = {}) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    const teams = await Team.find({
        status: TEAM_STATUS.OPEN,
        members: { $ne: userId },
    })
        .populate('leader', 'name email avatar')
        .lean();

    const scoredTeams = teams
        .map((team) => ({
            ...team,
            compatibilityScore: computeTeamScore(user, team),
        }))
        .sort((a, b) => b.compatibilityScore.total - a.compatibilityScore.total);

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(
        Math.max(1, parseInt(limit, 10)),
        PAGINATION.MAX_LIMIT
    );
    const skip = (safePage - 1) * safeLimit;
    const paginatedTeams = scoredTeams.slice(skip, skip + safeLimit);

    return {
        teams: paginatedTeams,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total: scoredTeams.length,
            totalPages: Math.ceil(scoredTeams.length / safeLimit),
        },
    };
};

const getRecommendedTeammates = async (userId, {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
} = {}) => {
    const user = await User.findById(userId);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    const students = await User.find({
        _id: { $ne: userId },
        role: 'student',
    }).lean();

    const scoredStudents = students
        .map((student) => ({
            ...student,
            compatibilityScore: computeScore(user, student),
        }))
        .sort((a, b) => b.compatibilityScore.total - a.compatibilityScore.total);

    const safePage = Math.max(1, parseInt(page, 10));
    const safeLimit = Math.min(
        Math.max(1, parseInt(limit, 10)),
        PAGINATION.MAX_LIMIT
    );
    const skip = (safePage - 1) * safeLimit;
    const paginatedStudents = scoredStudents.slice(skip, skip + safeLimit);

    return {
        students: paginatedStudents,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total: scoredStudents.length,
            totalPages: Math.ceil(scoredStudents.length / safeLimit),
        },
    };
};

const getCompatibilityScore = async (userId, targetId) => {
    const [user, target] = await Promise.all([
        User.findById(userId),
        User.findById(targetId),
    ]);

    if (!user) {
        throw ApiError.notFound('Không tìm thấy người dùng');
    }

    if (!target) {
        throw ApiError.notFound('Không tìm thấy sinh viên cần so sánh');
    }

    return computeScore(user, target);
};

module.exports = {
    getRecommendedTeams,
    getRecommendedTeammates,
    getCompatibilityScore,
    computeScore,
    computeTeamScore,
    getKeywords,
    jaccardSimilarity,
};
