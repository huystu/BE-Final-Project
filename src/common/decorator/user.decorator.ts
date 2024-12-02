import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    return key ? user?.[key] : user;
  },
);
