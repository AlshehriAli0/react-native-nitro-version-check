import { NitroModules } from "react-native-nitro-modules";
import type { VersionCheck as VersionCheckType } from "./specs/Version.nitro";

const VersionCheck = NitroModules.createHybridObject<VersionCheckType>("VersionCheck");

export const version = VersionCheck.version;
export const buildNumber = VersionCheck.buildNumber;
export const packageName = VersionCheck.packageName;
export const getCountry = VersionCheck.getCountry.bind(VersionCheck);

export default VersionCheck;