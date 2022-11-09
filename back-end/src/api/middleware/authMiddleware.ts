// extract token from request
import * as jose from 'jose'
import * as dotenv from "dotenv";
dotenv.config({ path: '../.env' });
export const userAuth = async(authtoken:string) => {
    let token = ''
    if(authtoken !== undefined){
        token =authtoken.replace('Bearer ', '');
    }
    const algorithm = 'ES256'
 
    const ecPublicKey = await jose.importSPKI(process.env.PUBLIC_KEY as string, algorithm)
    try {
    const { payload } = await jose.jwtVerify(token, ecPublicKey, {
         issuer: 'urn:example:issuer',
        audience: 'urn:example:audience',
    });
 
    return payload.data
    } catch (e) {
        return false
    }

}          
               