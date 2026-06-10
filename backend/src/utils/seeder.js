const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User.js');
const Team = require('../models/Team.js');
const { ROLES, TEAM_STATUS } = require('../config/constants.js');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ste_db';
const SALT_ROUNDS = 10;

const sampleUsers = [
    {
        name: 'Nguyen Van An',
        email: 'an.nv@fpt.edu.vn',
        password: 'Password@123',
        role: ROLES.STUDENT,
        gpa: 3.8,
        skills: ['JavaScript', 'React', 'Node.js'],
        interests: ['Phát triển web', 'Trí tuệ nhân tạo'],
        major: 'Kỹ thuật phần mềm',
        description: 'Yêu thích phát triển full-stack và đã có kinh nghiệm xây dựng ứng dụng web.'
    },
    {
        name: 'Tran Thi Bich',
        email: 'bich.tt@fpt.edu.vn',
        password: 'Password@123',
        role: ROLES.STUDENT,
        gpa: 3.5,
        skills: ['Python', 'Machine Learning', 'Phân tích dữ liệu'],
        interests: ['Trí tuệ nhân tạo', 'Khoa học dữ liệu'],
        major: 'Trí tuệ nhân tạo',
        description: 'Quan tâm đến học máy và các giải pháp dựa trên dữ liệu.'
    },
    {
        name: 'Le Hoang Cuong',
        email: 'cuong.lh@fpt.edu.vn',
        password: 'Password@123',
        role: ROLES.STUDENT,
        gpa: 3.2,
        skills: ['Java', 'Spring Boot', 'MySQL'],
        interests: ['Phát triển backend', 'Điện toán đám mây'],
        major: 'Công nghệ thông tin',
        description: 'Muốn xây dựng hệ thống backend ổn định, dễ mở rộng và triển khai trên cloud.'
    },
    {
        name: 'Pham Minh Duc',
        email: 'duc.pm@fpt.edu.vn',
        password: 'Password@123',
        role: ROLES.STUDENT,
        gpa: 3.9,
        skills: ['React Native', 'Flutter', 'Firebase'],
        interests: ['Phát triển mobile', 'Thiết kế UI/UX'],
        major: 'Kỹ thuật phần mềm',
        description: 'Tập trung phát triển ứng dụng di động có trải nghiệm người dùng mượt mà.'
    },
    {
        name: 'Vo Thanh Hang',
        email: 'hang.vt@fpt.edu.vn',
        password: 'Password@123',
        role: ROLES.STUDENT,
        gpa: 3.6,
        skills: ['C#', '.NET', 'SQL Server'],
        interests: ['Phát triển game', 'Phát triển web'],
        major: 'An toàn thông tin',
        description: 'Thích phát triển game và đang mở rộng kỹ năng sang công nghệ web.'
    },
    {
        name: 'Admin STE',
        email: 'admin@ste.edu.vn',
        password: 'Admin@123',
        role: ROLES.ADMIN,
        gpa: 0,
        skills: [],
        interests: [],
        major: 'Quản trị hệ thống',
        description: 'Quản trị viên hệ thống STE.'
    },
    {
        name: 'Dr. Nguyen Lecturer',
        email: 'lecturer@fpt.edu.vn',
        password: 'Lecturer@123',
        role: ROLES.LECTURER,
        gpa: 0,
        skills: ['Giảng dạy', 'Nghiên cứu', 'Cố vấn'],
        interests: ['Giáo dục', 'Công nghệ'],
        major: 'Khoa học máy tính',
        description: 'Giảng viên hướng dẫn dự án tại FPT University.'
    }
];

const hashPasswords = async (users) => {
    return Promise.all(
        users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, SALT_ROUNDS)
        }))
    );
};

const buildTeams = (createdUsers) => {
    const students = createdUsers.filter((u) => u.role === ROLES.STUDENT);
    return [
        {
            name: 'Nhóm xây dựng STE',
            description: 'Phát triển nền tảng Smart Student Environment dành cho sinh viên FPT University.',
            leader: students[0]._id,
            members: [students[0]._id, students[1]._id, students[2]._id],
            status: TEAM_STATUS.IN_PROGRESS,
            maxMembers: 5,
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            tags: ['Phát triển web', 'Full Stack']
        },
        {
            name: 'Nhóm học AI',
            description: 'Nhóm cùng học và triển khai các dự án học máy, phân tích dữ liệu.',
            leader: students[1]._id,
            members: [students[1]._id, students[3]._id],
            status: TEAM_STATUS.OPEN,
            maxMembers: 4,
            requiredSkills: ['Python', 'Machine Learning', 'Phân tích dữ liệu'],
            tags: ['Trí tuệ nhân tạo', 'Khoa học dữ liệu']
        }
    ];
};

const seed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('[Seeder] Connected to MongoDB');

        await Promise.all([
            User.deleteMany({}),
            Team.deleteMany({})
        ]);
        console.log('[Seeder] Deleted all old data');

        const usersWithHashedPw = await hashPasswords(sampleUsers);
        const createdUsers = await User.insertMany(usersWithHashedPw);
        console.log(`[Seeder] Added ${createdUsers.length} users`);

        const teams = buildTeams(createdUsers);
        const createdTeams = await Team.insertMany(teams);
        console.log(`[Seeder] Added ${createdTeams.length} teams`);

        console.log('[Seeder] Done');
        process.exit(0);
    } catch (err) {
        console.error(`[Seeder] Error: ${err.message}`);
        process.exit(1);
    }
};

seed();
