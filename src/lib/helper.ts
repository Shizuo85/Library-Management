import axios from "axios";
import fs from "fs";
import { unlink } from "fs/promises";

class HelperLib{
    async cleanUp(paths: any) {
        for (let file of paths) {
            if (fs.existsSync(file)) {
                await unlink(file);
            }
        }
    }

    async getDeviceInfo(userAgent: any, ip: any){
        let device: string;
        if (/windows phone/i.test(userAgent)) {
            device = "Windows Phone";
        } else if (/windows/i.test(userAgent)) {
            device = "Windows";
        } else if (/android/i.test(userAgent)) {
            device = "Android";
        } else if (/ipod|ipad|iphone|mac/i.test(userAgent)) {
            device = "iOS";
        } else {
            device = "Unknown Device";
        }
        const locationData = (await axios({ method: "get", url: `http://ip-api.com/json/${ip}` })).data;
        const location = locationData.country ? locationData.regionName + ", " + locationData.country : "Unknown Location";
        return { device, location };
    }
}

export default new HelperLib();