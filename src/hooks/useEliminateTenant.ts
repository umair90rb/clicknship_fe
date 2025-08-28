import useTenant from "./useTenant";


export default function useEliminateTenant() {
    const tenantId = useTenant();

    if(tenantId) {
        const [tenantId, ...rest] = window.location.host.split('.');
        window.location.href = rest.join('.');
    }
}