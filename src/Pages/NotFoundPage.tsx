import { Header } from '../components/Header'
import './NotFoundPage.css'

export function NotFoundPage() {
    return (
        <>
            <title>Not Found</title>
            <Header />
            <div className="not-found">
                404 - Page not found
            </div>
        </>
    );
}