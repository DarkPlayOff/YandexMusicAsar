# Модификация на [YandexMusicModClient](https://github.com/TheKing-OfTime/YandexMusicModClient) для активации плюса
[![TotalDownloads](https://img.shields.io/github/downloads/DarkPlayOff/YandexMusicAsar/total?label=Загрузок)](https://github.com/DarkPlayOff/YandexMusicAsar/releases "Download")

<p align="left">
	<a href="https://discord.gg/HGNKDxwHEH">
      <img height="35.48" alt="Сервер" src="https://github.com/user-attachments/assets/b7c8a272-b48c-411f-aca3-6512086a9a18">
   </a>
   <a href="https://github.com/TheKing-OfTime/YandexMusicModClient/">
      <img width="96" alt="Русский" src="https://github.com/TheKing-OfTime/YandexMusicModClient/blob/master/assets/Ru_Badge_Highlighted.png">
   </a>
  <a href="https://github.com/TheKing-OfTime/YandexMusicModClient/blob/master/doc/en/README.md">
      <img width="96" alt="English" src="https://github.com/TheKing-OfTime/YandexMusicModClient/blob/master/assets/En_Badge.png">
   </a>
</p>

## Это модификация для [настольного приложения Яндекс Музыка](https://music.yandex.com/download/)
### YandexMusicModClient или его разработчик не связаны с Яндексом или какой-либо из их компаний, сотрудников и т.д.


## Установка
<details>
<summary>Windows cmd</summary>
  
0. Загрузите последнюю версию клиента Яндекс музыки с официального сайта https://music.yandex.com/download/
1. Откройте командную строку (Win + R -> cmd -> Enter)
2. Выполните эту команду
   ```bat
   curl -L https://github.com/DarkPlayOff/YandexMusicAsar/releases/latest/download/app.asar > %localappdata%/Programs/YandexMusic/resources/app.asar
   ```
3. Готово!

</details>

<details>
<summary>MacOs/Windows</summary>
  
  [YandexMusicModPatcher](https://github.com/DarkPlayOff/YandexMusicModPatcher)
  
</details>
    
> [!NOTE]  
> После установки модификации может потребоваться повторный вход в аккаунт.

## Сборка проекта из исходников

0. Убедитесь что Яндекс Музыка и node.js уже установлены
1. Склонируйте проект `git clone https://github.com/TheKing-OfTime/YandexMusicModClient.git`
2. Установите зависимости `npm install` Учтите, что зависимости вам нужно устанавливать в корневой папке проекта, а не в `/src/`
3. Для удобства сборки в проекте есть cli скрипт `toolset.js`. Он позволят быстро и просто распоковать, упаковать, опубилковать, спуфнуть, или пропатчить код.
4. `node toolset.js build -d -m`. Эта команда автоматически оптимизирует код (Минифицирует его), а после запакует его по пути Яндекс Музыки по умолчанию `%localappdata%/Programs/YandexMusic/resources/app.asar`
5. Для быстрой сборки проекта при разработке можете убрать флаг -m. Без него не будет долгого процесса минификции

## Возможности

### Discord Статус
<details>
   <summary>Подробнее</summary>

<details>
   <summary>Настройки</summary>

      "discordRPC": {
			"enable": true or false,                         //Включает или отключает disocrd RPC
			"applicationIDForRPC": "1124055337234858005",    //ID пользовательского приложения вашего для discord RPC
			"showButtons": true or false,                    //Включает или отключает все кнопки в статусе discord 
			"overrideDeepLinksExperiment": true or false,    //Включает или отключает разделение веб-кнопок и кнопок рабочего стола на одну кнопку
			"showGitHubButton": true or false,               //Включает или отключает кнопку Github, если для параметра overrideDeepLinksExperiment установлено значение true
			"afkTimeout": 15,				 //Время в минутах через которое статус в дискорде пропадёт если трек был поставлен на паузу.
			"showAlbum": true or false,                      //Включает или отключает строчку с информацией о альбоме в статусе discord 
   			"showSmallIcon": true or false,                  //Включает или отключает икноку статуса прослушивания в статусе discord 
      }

</details>


Добавляет поддержку отображения текущего трека как статуса в Discord
![image](https://github.com/user-attachments/assets/ff3b0726-6f83-4849-bce6-c5eb31523efa)

</details>

### Управление плеером с других устройств
<details>
   <summary>Подробнее</summary>


Добавляет поддержку управления воспроизведением настольного клиента с других устройств.

<img width="250" alt="Список устройств для воспроизведения" src="https://github.com/user-attachments/assets/17196b75-85c4-42f0-af81-ab62123fde5c">
<img width="250" alt="Управление воспроизведение с телефона на ПК клиенте" src="https://github.com/user-attachments/assets/305a94f9-4908-4c47-9d75-c0838dbad805">

<details>
   <summary>Настройки</summary>

Можно выключить в настройках внутри приложения

![image](https://github.com/user-attachments/assets/8b7280d6-f2ef-4a0e-8835-32e173a1e843)

</details>

</details>

### Скробблинг Last.FM
<details>
   <summary>Подробнее</summary>


Добавляет поддержку cкробблинга в Last.FM. Трек заскробблится если вы прослушаете хотя бы его половину. (Но при этом запрос скроббла отправиться при смене трека)

<img width="550" alt="Страница пользователя Last.FM с заскроббленными треками" src="https://github.com/user-attachments/assets/9a47a37b-b895-4a06-8538-fb94eb009290">

<details>
   <summary>Настройки</summary>

Авторизоваться в Last.FM, а также включить/выключить функцию можно в соответствующем меню в настройках приложения.

![image](https://github.com/user-attachments/assets/0fbd13ed-7837-49c2-9b28-5bc210480002)

<details>
   <summary>Процесс авторизации</summary>

https://github.com/user-attachments/assets/079f8b38-ca6b-4fef-b6a2-efa853fd583f

</details>

</details>

</details>


### Настраиваемая папка кеша
<details>
   <summary>Подробнее</summary>


В ванильной версии весь кеш (в том числе скаченные вами треки для оффлейн прослушивания) хранится по пути `%appdata%/YandexMusic/`

Данная функия позволяет использовать для кеша другой путь. Например чтобы 10 гигабайт скаченной вами музыки не тратили место на системном диске

![image](https://github.com/user-attachments/assets/f48a8d32-d03f-4770-8204-460f37ab059f)

</details>


### Глобальные хоткеи
<details>
   <summary>Подробнее</summary>


Добавляет поддержку глобальных хоткеев.

<details>
   <summary>Настройки</summary>

	"globalShortcuts": {
		"TOGGLE_PLAY": "Ctrl+/",
		"MOVE_FORWARD": "Ctrl+,",
		"MOVE_BACKWARD": "Ctrl+.",
		"TOGGLE_SHUFFLE": "Ctrl+\'",
		"REPEAT_NONE": undefined,
		"REPEAT_CONTEXT": undefined,
		"REPEAT_NONE": undefined,
  		"TOGGLE_LIKE": undefined,
  		"TOGGLE_DISLIKE": undefined,
	}

</details>

</details>

### Улучшение превью панели задач
<details>
   <summary>Подробнее</summary>


Добавляет поддержку расширений панели задач (Taskbar Extensions)

<details>
   <summary>Настройки</summary>

      "taskBarExtensions": {
			"enable": true or false //Включает или отключает расширения панели задач
			"coverAsThumbnail": true or false //Включает или отключает замену Live превью на картинку обложки трека
		}

</details>

![image](https://github.com/user-attachments/assets/ec4017ab-9fb7-4e19-a2e6-d30dfbaa6cdc)


</details>

### Возврат кнопки дизлайка
<details>
   <summary>Подробнее</summary>

Возвращает кнопку дизлайка в плеер на главной.

![image](https://github.com/user-attachments/assets/22a83331-dfc4-4c7b-92c9-4fdbe2758910)

</details>

### Возврат кнопки повтора
<details>
   <summary>Подробнее</summary>

Возвращает кнопку повтора в плеер на главной когда играет Моя Волна.

</details>

### Отображение качества трека
<details>
   <summary>Подробнее</summary>

Отображает качество либо кодек текущего трека

<details>
   <summary>Настройки</summary>

	"playerBarEnhancement": {
  		"showDislikeButton": true //Включает или выключает отображение кнопки дизлайка в проигрывателе.
		"showCodecInsteadOfQualityMark": true //Показать кодек вместо качества
	}

</details>

![image](https://github.com/user-attachments/assets/424434fb-5e66-4a85-8ca2-90179cb7f357)


</details>

### Улучшенная анимация Моей Волны
<details>
   <summary>Подробнее</summary>

Улучшает поведение анимации Моей Волны. Она начинает лучше адаптироваться к музыке. Также позволяет настраивать частоту кадров в секунду при рендеринге анимации.
<details>
   <summary>Настройки</summary>

      "vibeAnimationEnhancement": {
	    "maxFPS": 25,             	// Максимально допустимая частота кадров в секунду. По умолчанию: 25. Рекомендуемое: 25 - 144. Не устанавливайте значание меньше 1
	    "intensityCoefficient": 1, 	// Чувствительность музыкального анализа. По умолчанию: 1; Рекомендуемое: 0,5 - 2; При значении 0 отключается улучшение анимации (почти :D)
	    "linearDeBoost": 5,		// [УСТАРЕЛО] Коэффициент выделения пиков в треке от основного трека. По умолчанию: 5. Рекомендуемое: 2 - 8. Если 1, отключает разделение пиков.
	    "playOnAnyEntity": false,	// Если включено, анимация воспроизводится, даже если источник трека не Моя Волна.
	    "disableRendering": false	// Полностью отключает анимацию. Используйте только если почувствуете значительное падение кадров в секунду. В противном случае подберите оптимальное значение параметра maxFPS для вашей системы.
      }

</details>

До:

https://github.com/user-attachments/assets/23a8da4d-3d6a-43c6-a5f5-965e065ed912

После:

https://github.com/user-attachments/assets/b062a3ee-d05e-4cf3-8e03-b6f8bf66525c

</details>

### Поиск при добавлении трека в плейлист
<details>
   <summary>Подробнее</summary>

Добавляет строку поиска в контекстное меню выбора плейлиста.

![image](https://github.com/user-attachments/assets/03924f52-6e37-4d6a-ad9e-c079ec739cd8)


</details>

### Информация о скачанных треках
<details>
   <summary>Подробнее</summary>

Добавляет информацию о скачанных треках на страницу настроек (количество скачанных треков и используемое хранилище для скачанных треков)

![image](https://github.com/user-attachments/assets/d3ba9ada-941c-4bd2-8c53-dad54090bf4e)


</details>

### Скачивание текущего трека в файл
<details>
   <summary>Подробнее</summary>

Позволяет скачать текущий трек вам на ПК.

![image](https://github.com/user-attachments/assets/95a52251-401a-4071-9ee3-914b8c7b7c8f)

![image](https://github.com/user-attachments/assets/aaf79024-34cb-4159-9790-501f21534e54)



</details>

### Эксперементы
<details>
   <summary>Подробнее</summary>

Позволяет включать/выключать эксперементы. Для этого вам нужно включить Режим разработчика.

![image](https://github.com/user-attachments/assets/b341e6cb-58e3-4dfa-b8b3-e6ece72539a5)
</details>

## Настройки
<details>
Настройки можно найти в `%appdata%\YandexMusic\config.json`

Настройки внутри приложения:
<p align="left">
<img width="500" alt="Пример настроек внутри приложения" src="https://github.com/user-attachments/assets/b9aa1828-476c-4fde-86a8-84fb02eb0817">
</p>
</details>

## Благодарности
 • [Stephanzion](https://github.com/Stephanzion) за [патчи](https://github.com/Stephanzion/YandexMusicBetaMod) для активации плюса
 
 • [TheKing-OfTime](https://github.com/TheKing-OfTime) за [модификацию](https://github.com/TheKing-OfTime/YandexMusicModClient) и [патчер](https://github.com/TheKing-OfTime/YandexMusicModPatcher) для Яндекс Музыки

