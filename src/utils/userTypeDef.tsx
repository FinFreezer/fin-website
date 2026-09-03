export interface UserType {
    Username: string;
    Admin: boolean;
}

export type ReactUserSetter = React.Dispatch<React.SetStateAction<UserType | null>>;