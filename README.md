
# GBackup  

GBackup is a modern and intuitive application designed to locally back up your game saves.

![App Icon](build/appicon.png)  

## Installation

Download the latest version from the [release](https://github.com/glendsoza/gbackup/releases/) page
## Build  

GBackup is built using [Wails](https://github.com/wailsapp/wails), a framework for building modern desktop applications using Go and web technologies.  

### Steps to Build with Wails:  
1. Install Wails:  
   ```bash  
   go install github.com/wailsapp/wails/v2/cmd/wails@latest  
   ```  
2. Initialize the project (if not already initialized):  
   ```bash  
   wails init  
   ```  
3. Build the application:  
   ```bash  
   wails build  
   ```  
4. The built application will be available in the `build/bin` directory.  

## Usage  
1. Launch the GBackup application.  
2. Add games to the backup list by selecting their save directories.  
3. Manage your backups through the simple and intuitive UI.  

## Development  

If you’d like to contribute, please follow these steps:  

1. Fork the repository.  
2. Create a feature branch:  
   ```bash  
   git checkout -b feature-name  
   ```  
3. Commit your changes:  
   ```bash  
   git commit -m "Add feature name"  
   ```  
4. Push to the branch:  
   ```bash  
   git push origin feature-name  
   ```  
5. Submit a pull request.  

## Contributing Guidelines  
- Ensure your code follows the project's coding style.  
- Write clear commit messages and provide thorough descriptions in pull requests.  
- Test your changes thoroughly before submitting.  

## License  
This project is licensed under the [MIT License](LICENSE).  

## Contact  
For support or inquiries, please open an issue on the [GitHub repository](https://github.com/glendsoza/gbackup/issues).  
