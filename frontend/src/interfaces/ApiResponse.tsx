import ResponseResult from "./ResponseResult";

interface ApiResponse {
    count: number;
    next: string | null;
    results: Array<ResponseResult>;
}

export default ApiResponse;