import {validState,normalizeState,keepWeeklyUses} from './game-rules.js';
export function recoveryState(file,current,profile){
 if(file?.kind!=='nayleen-carnival-backup'||!validState(file.state))throw Error('Choose a Palace backup file.');
 if(file.profile&&file.profile!==profile)throw Error('This backup belongs to a different Palace profile.');
 const restored=normalizeState(file.state),now=normalizeState(current);
 keepWeeklyUses(restored,now);
 for(const key of ['tradeWeeks','weeklyClaims','mazeWeeks'])restored[key]=[...new Set([...(restored[key]||[]),...(now[key]||[])])];
 if(now.weeklyBox&&(!restored.weeklyBox||now.weeklyBox.week>=restored.weeklyBox.week))restored.weeklyBox=now.weeklyBox;
 if(now.manorRun&&(!restored.manorRun||now.manorRun.week>=restored.manorRun.week))restored.manorRun=now.manorRun;
 restored.clicker.lastTick=Date.now();return restored;
}
