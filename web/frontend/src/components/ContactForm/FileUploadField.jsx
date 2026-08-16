import { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from './ContactForm.module.css';

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIconLabel(file) {
  const name = String(file?.name || '').toLowerCase();
  if (file?.type?.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp|svg)$/.test(name)) {
    return 'image';
  }
  if (/\.(pdf)$/.test(name)) return 'pdf';
  if (/\.(doc|docx)$/.test(name)) return 'doc';
  return 'file';
}

export default function FileUploadField({ field, files = [], error, onChange, className = '' }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const max = Number(field.max_file_number) || 1;
  const labelId = `label-${field.id}`;
  const canAddMore = files.length < max;

  const applyFiles = useCallback(
    (incoming) => {
      const list = Array.from(incoming || []).slice(0, max);
      onChange(list);
    },
    [max, onChange]
  );

  const handleInputChange = (e) => {
    applyFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!canAddMore) return;
    applyFiles(e.dataTransfer?.files);
  };

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`${styles.fileField} ${className}`.trim()}>
      <span className={styles.label} id={labelId}>
        {field.label}
        {field.required ? <span className={styles.required}>*</span> : null}
      </span>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className={styles.fileInputHidden}
        multiple={max > 1}
        onChange={handleInputChange}
        aria-invalid={Boolean(error)}
        aria-labelledby={labelId}
      />

      {canAddMore ? (
        <div
          className={`${styles.fileDropzone} ${dragOver ? styles.fileDropzoneActive : ''} ${error ? styles.fileDropzoneError : ''}`}
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          aria-describedby={`${inputId}-hint`}
        >
          <span className={styles.fileDropIcon} aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className={styles.fileDropTitle}>
            {dragOver ? 'Drop file here' : 'Click to upload or drag and drop'}
          </span>
          <span className={styles.fileDropHint} id={`${inputId}-hint`}>
            {max > 1 ? `Up to ${max} files` : 'Single file'} · PDF, JPG, PNG or DOC
          </span>
        </div>
      ) : null}

      {files.length > 0 ? (
        <ul className={styles.fileList}>
          {files.map((file, index) => {
            const kind = fileIconLabel(file);
            const isImage = kind === 'image' && file instanceof File;

            return (
              <FilePreviewItem
                key={`${file.name}-${file.lastModified}-${index}`}
                file={file}
                kind={kind}
                isImage={isImage}
                onRemove={() => removeFile(index)}
              />
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function FilePreviewItem({ file, kind, isImage, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!isImage) return undefined;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <li className={styles.fileItem}>
      <div className={styles.fileItemPreview} aria-hidden="true">
        {previewUrl ? (
          <img src={previewUrl} alt="" />
        ) : (
          <span className={`${styles.fileTypeBadge} ${styles[`fileTypeBadge_${kind}`]}`}>
            {kind.toUpperCase()}
          </span>
        )}
      </div>
      <div className={styles.fileItemMeta}>
        <span className={styles.fileItemName}>{file.name}</span>
        <span className={styles.fileItemSize}>{formatFileSize(file.size)}</span>
        <span className={styles.fileItemStatus}>Ready to upload</span>
      </div>
      <button type="button" className={styles.fileRemoveBtn} onClick={onRemove} aria-label={`Remove ${file.name}`}>
        Remove
      </button>
    </li>
  );
}
