export function removeCmd(cmd?: string): string {
    if(cmd != undefined ) return cmd?.replace(/(\/\w+)\s*/, '') 
    else return ''
}

export function slice(input: Array<any>, size: number){
    if(size < 1) throw new Error("Size cannot be lower than 1")

    const output = []

    for (let i = 0; i < input.length; i += size) {
        output.push(input.slice(i, i + size));
    }

    return output
}
