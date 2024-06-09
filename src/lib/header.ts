
// @ts-ignore
export function Header() : headerinit | undefined {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("accessToken") ? localStorage.getItem("accessToken") : undefined;
    // const login = localStorage.getItem("adminLogin") ? localStorage.getItem("adminLogin") : 'false';

    let header = {}
    if(typeof token != "undefined"){
        header = {
            'Content-Type': 'application/json',
            "Authorization": "Bearer "+token };
    }else{
        // redirect('/admin/login')

        header = {'Content-Type': 'application/json',
            "Authorization": "Bearer "};
    }
    // console.log(token)
    return header
}