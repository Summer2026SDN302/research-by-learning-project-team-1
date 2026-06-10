const ROLES = Object.freeze({
    STUDENT: 'student',
    LECTURER: 'lecturer',
    ADMIN: 'admin',
    CLUB_LEADER: 'club_leader'
});

const TEAM_STATUS = Object.freeze({
    OPEN: 'open',
    CLOSED: 'closed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
});

const JOIN_REQUEST_STATUS = Object.freeze({
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
});

const MATCHING_CRITERIA = Object.freeze({
    GPA: 'gpa',
    SKILLS: 'skills',
    INTERESTS: 'interests',
    MAJOR: 'major',
    DESCRIPTION: 'description'
});

const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50
});

module.exports = {
    ROLES,
    TEAM_STATUS,
    JOIN_REQUEST_STATUS,
    MATCHING_CRITERIA,
    PAGINATION
};
