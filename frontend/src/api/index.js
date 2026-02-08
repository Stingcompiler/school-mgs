/**
 * API service layer for communicating with Django backend.
 */

const API_BASE = '/api';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const defaultOptions = {
            credentials: 'include', // Important for cookies
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        const response = await fetch(url, config);

        if (response.status === 401) {
            // Try to refresh token
            const refreshed = await this.refreshToken();
            if (refreshed) {
                // Retry the original request
                return fetch(url, config).then(res => res.json());
            }
            if (this.onSessionExpired) {
                this.onSessionExpired();
            }
            throw new Error('Session expired');
        }

        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.detail || 'An error occurred');
        }

        return data;
    }

    async refreshToken() {
        try {
            await fetch(`${API_BASE}/auth/refresh/`, {
                method: 'POST',
                credentials: 'include',
            });
            return true;
        } catch {
            return false;
        }
    }

    // Auth
    login(username, password) {
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    }

    logout() {
        return this.request('/auth/logout/', {
            method: 'POST',
        });
    }

    getMe() {
        return this.request('/auth/me/');
    }

    // Dashboard
    getDashboardStats() {
        return this.request('/dashboard/stats/');
    }

    // Students
    getStudents(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/students/${query ? `?${query}` : ''}`);
    }

    getStudent(id) {
        return this.request(`/students/${id}/`);
    }

    createStudent(data) {
        return this.request('/students/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    updateStudent(id, data) {
        return this.request(`/students/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    deleteStudent(id) {
        return this.request(`/students/${id}/`, {
            method: 'DELETE',
        });
    }

    // Payments
    createPayment(studentId, installmentNumber, amount = 100) {
        return this.request('/pay/', {
            method: 'POST',
            body: JSON.stringify({
                student_id: studentId,
                installment_number: installmentNumber,
                amount,
            }),
        });
    }

    getInstallments(studentId = null) {
        const query = studentId ? `?student=${studentId}` : '';
        return this.request(`/installments/${query}`);
    }

    getReceipts(studentId = null) {
        const query = studentId ? `?student=${studentId}` : '';
        return this.request(`/receipts/${query}`);
    }

    // Results
    getResults(studentId = null) {
        const query = studentId ? `?student=${studentId}` : '';
        return this.request(`/results/${query}`);
    }

    createResult(studentId, totalScore) {
        return this.request('/results/', {
            method: 'POST',
            body: JSON.stringify({
                student: studentId,
                total_score: totalScore,
            }),
        });
    }

    updateResult(id, totalScore) {
        return this.request(`/results/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ total_score: totalScore }),
        });
    }

    addSubjectResult(studentId, subjectName, score) {
        return this.request('/results/add_subject/', {
            method: 'POST',
            body: JSON.stringify({
                student_id: studentId,
                subject_name: subjectName,
                score,
            }),
        });
    }

    // Contact Messages (public)
    submitContactMessage(data) {
        return this.request('/contact-messages/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Contact Messages (admin)
    getContactMessages(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/contact-messages/${query ? `?${query}` : ''}`);
    }

    updateContactMessage(id, data) {
        return this.request(`/contact-messages/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    deleteContactMessage(id) {
        return this.request(`/contact-messages/${id}/`, {
            method: 'DELETE',
        });
    }

    onSessionExpired = null;
}

export const api = new ApiService();
export default api;
