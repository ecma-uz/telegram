{
  description = "Telegram bot for Ecma Uzbekistan";

  inputs = {
    # Too old to work with most libraries
    # nixpkgs.url = "github:nixos/nixpkgs/nixos-25.11";

    # Perfect!
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

    # The flake-utils library
    flake-utils.url = "github:numtide/flake-utils";

    #
    nix-deno.url = "github:nekowinston/nix-deno";
  };

  outputs = {
    # self,
    nixpkgs,
    flake-utils,
    nix-deno,
    ...
  }:
    flake-utils.lib.eachDefaultSystem
    (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [nix-deno.overlays.default];
        };
      in {
        # Nix script formatter
        formatter = pkgs.alejandra;

        # Development environment
        devShells.default = import ./shell.nix {inherit pkgs;};

        # Output package
        packages.default = pkgs.denoPlatform.mkDenoBinary {
          name = "telegram";
          version = "0.0.1";
          src = ./.;
          buildInputs = [];
          permissions.allow.all = true;
        };
      }
    );
  # // {
  #   # Overlay module
  #   nixosModules.bot = import ./module.nix self;
  # };
}
