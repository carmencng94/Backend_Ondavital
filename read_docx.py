import zipfile
import xml.etree.ElementTree as ET

def extract_text(docx_path):
    try:
        doc = zipfile.ZipFile(docx_path)
        xml_content = doc.read('word/document.xml')
        root = ET.fromstring(xml_content)
        # Handle namespaces if necessary, but simple iter() usually finds texts
        text_elements = []
        for elem in root.iter():
            if elem.tag.endswith('}t') and elem.text:
                text_elements.append(elem.text)
            elif elem.tag.endswith('}br'):
                text_elements.append('\n')
            elif elem.tag.endswith('}p'):
                text_elements.append('\n')
                
        return ''.join(text_elements)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    text = extract_text(r'c:\Users\Usuario\backend_ondavital\sistema-agentes-ia.docx')
    with open('docx_content.txt', 'w', encoding='utf-8') as f:
        f.write(text)
