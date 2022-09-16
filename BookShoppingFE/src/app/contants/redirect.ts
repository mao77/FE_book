const redirectUrl = (app: string) => {
  const redirectUri = 'http://localhost:4200';
  return `http://localhost:8080/oauth2/authorize/${app}?redirect_uri=${redirectUri}`;
};

export default redirectUrl;
