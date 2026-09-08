"""OpenViking_007 client wrapper and virtual context filesystem resolver."""

import os
from pathlib import Path
from typing import List, Optional
from app.config import settings


class VikingClient:
    """Wrapper for OpenViking_007 virtual context filesystem (viking://).
    
    Translates viking:// URIs to the local virtual filesystem path,
    enabling hierarchical context retrieval, branch inspection, and token pruning.
    """

    def __init__(self, root_uri: str = "viking://", base_fs_path: Optional[str] = None):
        self.root_uri = root_uri if root_uri.endswith("/") else f"{root_uri}/"
        if base_fs_path:
            self.base_fs_path = Path(base_fs_path)
        else:
            # Fallback to configured path relative to project root
            self.base_fs_path = Path(__file__).resolve().parent / "viking_filesystem"

    def uri_to_path(self, uri: str) -> Path:
        """Converts a viking:// URI into a local Path."""
        clean_uri = uri.replace("viking://", "").lstrip("/")
        return self.base_fs_path / clean_uri

    def read_leaf(self, uri: str) -> str:
        """Reads the content of a leaf node at the given viking:// URI."""
        file_path = self.uri_to_path(uri)
        if not file_path.exists() or not file_path.is_file():
            # Fallback: search by filename in viking_filesystem
            filename = Path(uri).name
            matches = list(self.base_fs_path.glob(f"**/{filename}"))
            if matches:
                file_path = matches[0]
            else:
                return f"# Document Not Found at {uri}"
        return file_path.read_text(encoding="utf-8")

    def list_branch(self, uri: str) -> List[str]:
        """Lists directory elements at the given viking:// branch URI."""
        dir_path = self.uri_to_path(uri)
        if not dir_path.exists() or not dir_path.is_dir():
            return []
        entries = []
        for item in dir_path.iterdir():
            sub_uri = f"{self.root_uri}{item.relative_to(self.base_fs_path).as_posix()}"
            if item.is_dir():
                sub_uri += "/"
            entries.append(sub_uri)
        return sorted(entries)

    def exists(self, uri: str) -> bool:
        """Checks if a leaf or branch exists in viking:// filesystem."""
        return self.uri_to_path(uri).exists()
