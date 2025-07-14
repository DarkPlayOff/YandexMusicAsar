using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace PatcherApp
{
    class Program
    {
        static int Main(string[] args)
        {
            if (args.Length < 1)
            {
                Console.WriteLine("Использование: dotnet PatcherApp.dll <путь_к_приложению>");
                return 1;
            }

            try
            {
                Installer.InstallMods(args[0]);
                Console.WriteLine("Патчинг успешно завершен!");
                return 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Ошибка: {ex.Message}");
                return 1;
            }
        }
    }

    static class Installer
    {
        private static void ReplaceFileContents(string path, string replace, string replaceTo)
        {
            Console.WriteLine($"Патчинг файла: {path}");
            string content = File.ReadAllText(path, Encoding.UTF8);
            if (!content.Contains(replace))
            {
                throw new Exception($"Не найдена строка для замены в файле {path}");
            }
            
            // Проверка на дублирование контента
            if (replaceTo.Contains(replace) && content.Contains(replaceTo))
            {
                Console.WriteLine($"Файл {path} уже был модифицирован, пропускаем");
                return;
            }
            
            string newContent = content.Replace(replace, replaceTo);
            File.WriteAllText(path, newContent, Encoding.UTF8);
            Console.WriteLine($"Файл успешно модифицирован: {path}");
        }

        public static void InstallMods(string appPath)
        {
            Console.WriteLine($"Начало патчинга приложения в папке: {appPath}");
            
            var newModsPath = Path.GetFullPath(Path.Combine(appPath, "app/_next/static/yandex_mod"));
            Console.WriteLine($"Создание папки модов: {newModsPath}");
            Directory.CreateDirectory(Path.GetDirectoryName(newModsPath));
            
            Console.WriteLine("Копирование файлов модов...");
            CopyFilesRecursively(Path.GetFullPath("mods"), newModsPath);
            Console.WriteLine("Файлы модов успешно скопированы.");

            // Вставить конфиг патчера в скрипт инициализации
            Console.WriteLine("Вставка конфигурации патчера в скрипт инициализации...");
            string indexJsPath = Path.Combine(newModsPath, "index.js");
            string configContent = File.ReadAllText(Path.Combine("mods", "index.js"), Encoding.UTF8);
            
            // Проверяем файл перед модификацией
            if (File.Exists(indexJsPath))
            {
                string currentContent = File.ReadAllText(indexJsPath, Encoding.UTF8);
                if (currentContent.Contains(configContent))
                {
                    Console.WriteLine($"Конфигурация уже присутствует в {indexJsPath}, пропускаем модификацию");
                }
                else
                {
                    ReplaceFileContents(indexJsPath, "//%PATCHER_CONFIG_OVERRIDE%", configContent);
                }
            }
            else
            {
                Console.WriteLine($"Создание нового файла: {indexJsPath}");
                File.WriteAllText(indexJsPath, configContent, Encoding.UTF8);
            }

            // Добавить _appIndex.js в исходный index.js приложения
            Console.WriteLine("Инжект _appIndex.js в исходный index.js приложения...");
            string mainIndexPath = Path.Combine(appPath, "main/index.js");
            string appIndexContent = File.ReadAllText("mods/inject/_appIndex.js", Encoding.UTF8);
            
            if (File.Exists(mainIndexPath))
            {
                string mainIndexContent = File.ReadAllText(mainIndexPath, Encoding.UTF8);
                if (mainIndexContent.Contains(appIndexContent))
                {
                    Console.WriteLine($"_appIndex.js уже присутствует в {mainIndexPath}, пропускаем модификацию");
                }
                else
                {
                    ReplaceFileContents(mainIndexPath, "createWindow_js_1.createWindow)();",
                        "createWindow_js_1.createWindow)();\n\n" + appIndexContent);
                }
            }
            else
            {
                Console.WriteLine($"Ошибка: Не найден основной файл приложения: {mainIndexPath}");
            }

            // Инжект инициализатора модов в html страницы
            Console.WriteLine("Инжект модов в HTML страницы...");
            var htmlFiles = Directory.GetFiles(Path.Combine(appPath, "app"), "*.html", SearchOption.AllDirectories);
            var injectHtml = File.ReadAllText("mods/inject/_appIndexHtml.js", Encoding.UTF8);
            Console.WriteLine($"Найдено {htmlFiles.Length} HTML файлов для патчинга");
            Parallel.ForEach(htmlFiles, file =>
            {
                Console.WriteLine($"Проверка HTML файла: {file}");
                var content = File.ReadAllText(file, Encoding.UTF8);
                
                // Проверяем, был ли уже модифицирован файл
                if (content.Contains(injectHtml))
                {
                    Console.WriteLine($"HTML файл {file} уже содержит инжект, пропускаем");
                    return;
                }
                
                Console.WriteLine($"Патчинг HTML файла: {file}");
                content = content.Replace("<head>",
                        $"<head><script>{File.ReadAllText("mods/inject/_appIndexHtml.js")}</script>");
                File.WriteAllText(file, content, Encoding.UTF8);
                Console.WriteLine($"HTML файл успешно модифицирован: {file}");
            });
        

            // Удалить видео-заставку
            var splashPath = Path.Combine(appPath, "app/media/splash_screen");
            if (Directory.Exists(splashPath))
            {
                Console.WriteLine($"Удаление видео-заставки из директории: {splashPath}");
                Directory.Delete(splashPath, true);
                Console.WriteLine("Видео-заставка успешно удалена");
            }
            else
            {
                Console.WriteLine($"Директория видео-заставки не найдена: {splashPath}");
            }

            Console.WriteLine("Все патчи успешно применены!");
        }

        public static void CopyFilesRecursively(string sourcePath, string targetPath)
        {
            Console.WriteLine($"Копирование файлов из {sourcePath} в {targetPath}");
            foreach (string dirPath in Directory.GetDirectories(sourcePath, "*", SearchOption.AllDirectories))
            {
                string newDir = dirPath.Replace(sourcePath, targetPath);
                Console.WriteLine($"Создание директории: {newDir}");
                Directory.CreateDirectory(newDir);
            }

            foreach (string newPath in Directory.GetFiles(sourcePath, "*.*", SearchOption.AllDirectories))
            {
                string targetFilePath = newPath.Replace(sourcePath, targetPath);
                Console.WriteLine($"Копирование файла: {newPath} -> {targetFilePath}");
                File.Copy(newPath, targetFilePath, true);
            }
            
            Console.WriteLine("Копирование файлов завершено");
        }
    }
}

