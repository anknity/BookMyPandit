export function isAdmin(role: string): boolean {
    return role === 'admin';
}

export function isPandit(role: string): boolean {
    return role === 'pandit';
}

export function isUser(role: string): boolean {
    return role === 'user';
}

export function getRedirectPath(role: string): string {
    switch (role) {
        case 'admin': return '/admin';
        case 'pandit': return '/pandit/dashboard';
        default: return '/';
    }
}
