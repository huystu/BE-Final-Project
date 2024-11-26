/* eslint-disable prettier/prettier */
export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiration: '15m',
    refreshTokenExpiration: '7d',
  };