const type = 'build'
export function Build(){
    return type === 'build' ? '/dist' : ''
}