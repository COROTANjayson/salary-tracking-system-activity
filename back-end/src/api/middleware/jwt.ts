import * as jose from 'jose'
import { createSecretKey, generateKeyPairSync,createPrivateKey } from 'crypto';
import * as dotenv from "dotenv";
dotenv.config({ path: './.env' });


export const generateToken = async(payload: jose.JWTPayload) =>{

  const algorithm = 'ES256'

const secret = await jose.importPKCS8(process.env.PRIVATEKEY as string, algorithm)
  
    const jwt = await new jose.SignJWT({data: payload})
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .sign(secret)
    
    return jwt;
};

export const encrypt = async(payload: jose.JWTPayload) => {
    const secretKey = new TextEncoder().encode( process.env.SECRET_KEY as string)
    const jwt = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .encrypt(secretKey)

  return jwt
}
export const decrypt = async( token: string) => {
  const secretKey = new TextEncoder().encode( process.env.SECRET_KEY as string)
  const { payload, protectedHeader } = await jose.jwtDecrypt(token, secretKey, {
      issuer: 'urn:example:issuer',
      audience: 'urn:example:audience',
    })
    return payload
}



















// const secret = await jose.importJWK(
  //   // {
  //   // alg: 'ES256',
  //   // crv: 'P-256',
  //   // kty: 'EC',
  //   // d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
  //   // x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  //   // y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
  //   // }
  //   {
  //     kty: 'RSA',
  //     e: 'AQAB',
  //     n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ',
  //   },
  //   'ES256',
  
  // )
  
  
  // const secret = createPrivateKey({key: process.env.PRIVATEKEY as string,
  //   format: "pem",
  //   type: "pkcs1",})
  // const secret = generateSecretKey()
  // console.log(process.env.PRIVATEKEY)
  // read private key value
    // const secret = createSecretKey(process.env.PRIVATEKEY, 'utf-8'); 
    // console.log(secretKey)
  // // generate JWT