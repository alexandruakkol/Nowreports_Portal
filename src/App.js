import './App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import { ConfigProvider } from 'antd';



function App() {
  return (
    <div className="App">
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            activeBarHeight:0,activeBarBorderWidth:0
          },
        },
      }}
    >
      <Navbar></Navbar>
      <Main></Main>
    </ConfigProvider>
    </div>
  );
}

export default App;
