import os

def scan_svelte_project(project_path, output_file):
    with open(output_file, 'w') as f:
        f.write("Svelte Project Structure:\n\n")
        
        for root, dirs, files in os.walk(project_path):
            for file in files:
                if (file.endswith('.svelte') or file.endswith('.css')) and not any(exclude in file for exclude in exclusions):
                    relative_path = os.path.relpath(os.path.join(root, file), project_path)
                    f.write(f"- {relative_path}\n")

# List of patterns to exclude
exclusions = [
    '.svelte-kit\\generated',
    'node_modules',
    'playwright-core\\lib\\vite'
]

if __name__ == "__main__":
    project_path = r'C:\Projet\yoank'  # Replace with your Svelte project path
    output_file = r'C:\Projet\yoank\svelte_structure.txt'

    scan_svelte_project(project_path, output_file)
    print(f"Project structure has been written to {output_file}")
