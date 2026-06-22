import * as axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

let pendingRequests = 0;
const loadingListeners = new Set<() => void>();

function notifyLoadingListeners() {
    loadingListeners.forEach(listener => listener());
}

function startRequest() {
    pendingRequests += 1;
    notifyLoadingListeners();
}

function finishRequest() {
    pendingRequests = Math.max(0, pendingRequests - 1);
    notifyLoadingListeners();
}

export function subscribeToApiLoading(listener: () => void) {
    loadingListeners.add(listener);
    return () => loadingListeners.delete(listener);
}

export function getApiLoadingSnapshot() {
    return pendingRequests > 0;
}

api.interceptors.request.use(config => {
    startRequest();
    return config;
});

api.interceptors.response.use(
    response => {
        finishRequest();
        return response;
    },
    error => {
        finishRequest();
        return Promise.reject(error);
    },
);

export default api;
