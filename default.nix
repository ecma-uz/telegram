{pkgs ? import <nixpkgs> {}, ...}: let
  lib = pkgs.lib;
in
  pkgs.buildDenoPackage {
    name = "telegram";
    version = "0.1.2";
    src = ./.;

    denoDepsHash = lib.fakeHash;
    binaryEntrypointPath = "./mod.ts";
    permissions.allow.all = true;
  }
