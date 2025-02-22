import { useEffect, useState, useContext, createContext } from "react";
import { useCookies } from "react-cookie";
import axios from "../utils/axios";
import { useRouter } from "next/router";

const AuthContext = createContext({});

export const AuthProvider = ({ toast, children }) => {
	const router = useRouter();
	const [profileName, setProfileName] = useState("");
	const [avatarImage, setAvatarImage] = useState("#");
	const [cookies, setCookies, removeCookies] = useCookies(["auth"]);
	const [token, SetToken] = useState(cookies.token);

	const setToken = (newToken) => {
		setCookies("token", newToken, { path: "/" });
		SetToken(newToken);
	};
	const deleteToken = () => {
		removeCookies("token");
		SetToken(null);
	};
	const logout = () => {
		deleteToken();
		toast.info("Logged out")
		router.push("/login");
	};

	useEffect(() => {
		if (token) {
			axios
				.get("auth/profile/", {
					headers: {
						Authorization: "Token " + token,
					},
				})
				.then((response) => {
					setAvatarImage(
						"https://ui-avatars.com/api/?name=" +
							response.data.name +
							"&background=fff&size=33&color=007bff"
					);
					setProfileName(response.data.name);
				})
				.catch((error) => {
					console.log("Some error occurred");
				});
		}
	}, [setAvatarImage, setProfileName, token]);

	return (
		<AuthContext.Provider
			value={{
				token,
				setToken,
				deleteToken,
				profileName,
				setProfileName,
				avatarImage,
				setAvatarImage,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
