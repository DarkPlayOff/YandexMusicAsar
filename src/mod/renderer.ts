import { initFetchInterceptor } from "~/mod/features/utils";

// Инициализация мода utils для перехвата запросов к yandex api
initFetchInterceptor();

// Инициализация мода на разблокировку плюса
import "./features/plus-unlocker";
