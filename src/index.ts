import { sys } from 'typescript';
import pens from './enterprise-numbers.json';
import sysObjectIDs from './sysObjectIDs.json';

interface SysInfo {
  vendor: string;
  category: string;
  model: string;
  roles?: string[];
}

interface SysObjIDInfo {
  [key: string]: SysInfo
}


function getDeviceInfo(oid: string, default_value?: string): SysInfo {

  if (oid.startsWith('.')) {
    oid = oid.substring(1);
  }

  return sysObjectIDs[oid] || { vendor: getOrg(oid, default_value), category: default_value, model: default_value };
}

function getOrg(Id: number | string, default_value?: string): string {

  let enterpriseNumber = Id;
  
  // if input is SNMP sysObjID 
  if (typeof Id === 'string') {
    if (Id.startsWith('1.3.6.1.4.1.')) {
      enterpriseNumber = Id.split('.')[6]

    } else if (Id.startsWith('.1.3.6.1.4.1.')) {
      enterpriseNumber = Id.split('.')[7]
    }

  }

  return pens[enterpriseNumber] || default_value;
}

export default getOrg;
export { getOrg, getDeviceInfo };