export const sessionSlice = (set: any, get: any) => ({
    session_id: "",
    setSessionId: (id: any) => {
        set({
            session_id: id
        })
    }
});