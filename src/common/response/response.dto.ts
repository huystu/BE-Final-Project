export class ResponseDto<T> {
  message: string; 
  status: number; 
  data: T; 
}
