export function fileToString(file: File): string {
      return JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      });
    }

export function stringToFile(str: string): File {
      const obj = JSON.parse(str);
      // Note: We can't recreate the actual file content, so this is just a placeholder
      return new File([""], obj.name, {
        type: obj.type,
        lastModified: obj.lastModified
      });
    }