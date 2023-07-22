import { createContext, FC, ReactNode, useState } from "react"

type CurrentUserType = {
  email: string;
  exp: number;
  iat: number;
  id: string;
  _id: string;
  role: "user" | "super-user" | "client-admin";
  username: string;
}

const AuthContext = createContext<{
  user: Partial<CurrentUserType>
  setUser: (user: any) => void;
}>(null);

const AuthContextProvider: FC<{ children: ReactNode }> = (props) => {

  const [user, setUser] = useState<Partial<CurrentUserType>>({});

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export {
  AuthContextProvider,
  AuthContext
}