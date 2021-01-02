export function removeCmd(cmd?: string): string {
    if(cmd != undefined ) return cmd?.replace(/(\/\w+)\s*/, '') 
    else return ''
}