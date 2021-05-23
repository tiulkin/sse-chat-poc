import React, {useState} from 'react';
import logo from './logo.svg';
import css from './app.module.css'
import chat from './chat.svg';
import close from './close.svg';
import {Chat} from './Chat';

function App() {
  const [isOpened, setIsOpened] = useState();
  const [name, setName] = useState(window.localStorage?.name || `Пользователь-${Math.random().toString(36).substring(2)}`);

    if (window.localStorage) {
        window.localStorage['name'] = name;
    }
  return (
    <div className={css.root}>
      <header className={css.header}>
        <img src={logo} className={css.logo} alt="logo" />
        <input onChange={event => setName(event.target.value ||  window.localStorage['name'] || 'anonymous')} value={name}/>
        <p>
            Нажмите на кнопку справа внизу и откроется чат!
        </p>
      </header>
      <img src={isOpened ? close : chat} className={css.chat} onClick={()=>setIsOpened(!isOpened)}/>
        {isOpened && (
            <Chat name={name} />
        )}
    </div>
  );
}

export default App;
