{ pkgs }: {
  deps = [
    pkgs.nodejs_22
    pkgs.nodePackages.npm
    pkgs.cacert
    pkgs.git
  ];
}