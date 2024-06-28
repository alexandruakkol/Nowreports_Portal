import '../app/globals.css';
import RootLayout from '../app/layout';

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};
  

function MyApp({ Component, pageProps }) {

    return (
        <RootLayout>
            <Component {...pageProps} />;
        </RootLayout>
    );
}

export default MyApp;