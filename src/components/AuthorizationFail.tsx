import { Header } from '../components/Header'
import type { UserType, ReactUserSetter } from '../utils/userTypeDef';
import './AuthorizationFail.css'

export function NotAuthorized({ activeUser, setActiveUser }:
    {
        activeUser: UserType | null,
        setActiveUser: ReactUserSetter,
    }
) {
    return (
        <>
            <title>Not Authorized</title>
            <Header activeUser={activeUser} setActiveUser={setActiveUser} />
            <div className="not-authorized">
                403 - No Authorization - Please log-in if you have not already done so to view this content.
            </div>
        </>
    );
}