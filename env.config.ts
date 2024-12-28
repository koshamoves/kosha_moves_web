import { EnvModes } from "@/constants/enums";


const appConfig = (): EnvValues => {
	switch (process.env.NODE_ENV) {
		case EnvModes.DEV:
			return {
				FIREBASE_API_KEY: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEV}`,
				FIREBASE_AUTH_DOMAIN: `${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV}`,
				FIREBASE_PROJECT_ID: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV}`,
				FIREBASE_STORAGE_BUCKET: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_DEV}`,
				FIREBASE_MESSAGING_SENDER_ID: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV}`,
				FIREBASE_APP_ID: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEV}`,
				env: "DEV",
			};
		case EnvModes.PROD:
			return {
				FIREBASE_API_KEY: `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
				FIREBASE_AUTH_DOMAIN: `${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`,
				FIREBASE_PROJECT_ID: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
				FIREBASE_STORAGE_BUCKET: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
				FIREBASE_MESSAGING_SENDER_ID: `${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
				FIREBASE_APP_ID: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}`,
				env: "PROD",
			};
		default:
			return {
				FIREBASE_API_KEY: "",
				FIREBASE_AUTH_DOMAIN: "",
				FIREBASE_PROJECT_ID: "",
				FIREBASE_STORAGE_BUCKET: "",
				FIREBASE_MESSAGING_SENDER_ID: "",
				FIREBASE_APP_ID: "",
				env: "DEV",
			};
	}
};

type EnvValues = {
	FIREBASE_API_KEY: string,
	FIREBASE_AUTH_DOMAIN: string,
	FIREBASE_PROJECT_ID: string,
	FIREBASE_STORAGE_BUCKET: string,
	FIREBASE_MESSAGING_SENDER_ID: string,
	FIREBASE_APP_ID: string;
	env: keyof typeof EnvModes;
};

export default appConfig();
