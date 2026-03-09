import sys

files = ['index.html', 'oppdag.html', 'deals.html', 'varsler.html', 'historikk.html']

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        if 'Ã' in content:
            # The file was originally UTF-8, read as cp1252, and written as UTF-8.
            # So the current content is a unicode string where characters like 'Ã' appear.
            # To get back the original UTF-8 bytes, we encode the current string as cp1252.
            original_bytes = content.encode('cp1252')
            
            # Now we decode those bytes as UTF-8 to get the original string.
            fixed_content = original_bytes.decode('utf-8')
            
            with open('test_' + f, 'w', encoding='utf-8') as out_file:
                out_file.write(fixed_content)
                
            print(f"Fixed {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")
