<p align="center">
    <img src=".github/assets/header.png" alt="Ecma Uzbekistan's {Telegram}">
</p>

<p align="center">
    <h3 align="center">Telegram bot for managing all sub-communities.</h3>
</p>

<p align="center">
    <img align="center" src="https://img.shields.io/github/languages/top/ecma-uz/telegram?style=flat&logo=javascript&logoColor=ffffff&labelColor=00AC5B&color=00AC5B" alt="Top Used Language">
</p>

## About

Ecma Uzbekistan consists of sub-communities which needs moderation tools like telegram bots. Therefore, it was decided to implement a single telegram bot for all sub-communities to moderate, manage and provide.

## Development

This project has been migrated to Node.js with Grammy.js. To get started:

```bash
# Install dependencies
npm install

# Create a config.toml file with your bot token
# Example:
# token = "YOUR_BOT_TOKEN"
# mode = "polling"
# host = "https://your-domain.com"
# port = 8000

# Start development server with hot reload
npm run dev -- --config config.toml

# Or build and run in production
npm run build
npm run start -- --config config.toml
```

## Configuration

Create a `config.toml` file with your bot configuration:

```toml
token = "YOUR_BOT_TOKEN_HERE"
host = "127.0.0.1"
port = 8000
mode = "polling"
```

## Building

```bash
# Build for production
npm run build

# Start production server
npm start -- --config config.toml
```

## Thanks

- [Orzklv](https://github.com/orzklv) - Bootstraping this project + devops management.
- [Diyorbek](https://github.com/diyorbekrustamjonov) - Maintaining this website keeping it active and up to date.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<p align="center">
    <img src=".github/assets/footer.png" alt="Ecma Uzbekistan's {Telegram}">
</p>
