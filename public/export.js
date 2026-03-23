/**
 * 导出功能模块
 * 支持 Markdown 和 PDF 格式导出
 */

const ExportModule = {
  /**
   * 导出为 Markdown 文件
   * @param {string} content - Markdown 内容
   * @param {string} filename - 文件名（不含扩展名）
   */
  exportAsMarkdown(content, filename = 'document') {
    try {
      // 创建 Blob 对象
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 释放 URL 对象
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('导出 Markdown 失败:', error);
      return false;
    }
  },

  /**
   * 导出为 PDF 文件（通过打印对话框）
   * @param {HTMLElement} element - 要打印的元素
   * @param {string} title - 打印标题
   */
  exportAsPDF(element, title = 'Document') {
    try {
      // 保存当前标题
      const originalTitle = document.title;
      // 设置打印标题
      document.title = title;

      // 添加打印样式优化
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          body * {
            visibility: hidden;
          }
          ${element.tagName === 'DIV' ? `.${element.className}` : element.tagName} {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .code-copy-btn {
            display: none !important;
          }
          pre code {
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
          }
          @page {
            margin: 2cm;
          }
        }
      `;
      style.id = 'print-styles';
      document.head.appendChild(style);

      // 调用打印对话框
      window.print();

      // 打印完成后清理样式
      setTimeout(() => {
        document.head.removeChild(style);
        document.title = originalTitle;
      }, 100);

      return true;
    } catch (error) {
      console.error('导出 PDF 失败:', error);
      return false;
    }
  },

  /**
   * 显示导出菜单
   * @param {HTMLElement} button - 触发按钮
   * @param {string} content - Markdown 内容（用于导出 Markdown）
   * @param {HTMLElement} previewElement - 预览元素（用于导出 PDF）
   * @param {string} filename - 文件名
   * @param {Function} onClose - 关闭回调
   */
  showExportMenu(button, content, previewElement, filename = 'document', onClose) {
    // 如果菜单已存在，先关闭
    const existingMenu = document.getElementById('export-menu');
    if (existingMenu) {
      existingMenu.remove();
      if (onClose) onClose();
      return;
    }

    // 创建导出菜单
    const menu = document.createElement('div');
    menu.id = 'export-menu';
    menu.className = 'export-menu';

    // 添加菜单项
    const menuItems = [
      {
        text: window.I18n?.t('下载 Markdown') || 'Download Markdown',
        icon: '📄',
        action: () => {
          const success = this.exportAsMarkdown(content, filename);
          if (success) {
            this.showNotification(window.I18n?.t('导出成功') || 'Export successful');
          } else {
            this.showNotification(window.I18n?.t('导出失败') || 'Export failed', 'error');
          }
          menu.remove();
          if (onClose) onClose();
        }
      },
      {
        text: window.I18n?.t('打印为 PDF') || 'Print as PDF',
        icon: '🖨️',
        action: () => {
          const success = this.exportAsPDF(previewElement, filename);
          if (!success) {
            this.showNotification(window.I18n?.t('导出失败') || 'Export failed', 'error');
          }
          menu.remove();
          if (onClose) onClose();
        }
      }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('button');
      menuItem.className = 'export-menu-item';
      menuItem.innerHTML = `<span class="icon">${item.icon}</span><span class="text">${item.text}</span>`;
      menuItem.addEventListener('click', item.action);
      menu.appendChild(menuItem);
    });

    // 添加到页面
    document.body.appendChild(menu);

    // 定位菜单（需要在添加到 DOM 后获取宽度）
    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.left = `${Math.max(0, rect.right - menu.offsetWidth)}px`;

    // 点击外部关闭菜单
    const closeOnClickOutside = (e) => {
      if (!menu.contains(e.target) && e.target !== button) {
        menu.remove();
        document.removeEventListener('click', closeOnClickOutside);
        if (onClose) onClose();
      }
    };
    // 使用 setTimeout 避免立即触发
    setTimeout(() => {
      document.addEventListener('click', closeOnClickOutside);
    }, 0);

    return menu;
  },

  /**
   * 显示通知
   * @param {string} message - 通知消息
   * @param {string} type - 通知类型（success/error）
   */
  showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `export-notification export-notification-${type}`;
    notification.textContent = message;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // 自动消失
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }
};

// 导出到全局
window.ExportModule = ExportModule;
