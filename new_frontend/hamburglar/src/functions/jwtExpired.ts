import jwt_decode from "jwt-decode";

export const jwtExpired = (jwt: string): boolean => {
    const d = jwtDate(jwt)
    // If date is less than now (i.e. date is in past)
    return(d < new Date())
}

export const jwtDate = (jwt: string): Date => {
    const decoded: { exp: string } = jwt_decode(jwt);
    let d = new Date(0)
    d.setUTCSeconds(Number(decoded.exp))
    return d;
}