interface PageProps{
    params:Promise<{
        executionId:string
    }>
}   


export default async function Page({params}:PageProps) {

    const {executionId} = await params;

    return (<>
        <h1>executions is: {executionId}</h1>
    </>)
}