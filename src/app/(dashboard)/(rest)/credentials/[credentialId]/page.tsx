interface PageProps{
    params:Promise<{
        credentialId:string
    }>
}   


export default async function Page({params}:PageProps) {

    const {credentialId} = await params;

    return (<>
        <h1>credentials is: {credentialId}</h1>
    </>)
}