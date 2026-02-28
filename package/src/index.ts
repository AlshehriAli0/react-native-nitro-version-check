import { NitroModules } from "react-native-nitro-modules";
import type { VersionCheck as VersionCheckType } from "./specs/Version.nitro";

const VersionCheck = NitroModules.createHybridObject<VersionCheckType>("VersionCheck");

export const getVersion = VersionCheck.getVersion.bind(VersionCheck);
export default VersionCheck;
