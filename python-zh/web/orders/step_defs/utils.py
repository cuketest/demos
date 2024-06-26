import openpyxl

# 读取 Excel 文件数据
def read_xlsx(filename):
    worksheet = openpyxl.load_workbook(filename).worksheets[0]
    headers = []
    body = []
    data = []
    for index, row in enumerate(worksheet.rows):
        if index == 0:
            for cell in row:
                headers.append(cell.value)
        else:
            row_value = []
            row_kv = {}
            for col, cell in enumerate(row):
                row_value.append(cell.value)
                row_kv[headers[col]] = cell.value
            body.append(row_value)
            data.append(row_kv)
    return data

# 根据订单编号查找订单
def find_order(order_no, data):
    for row in data:
        if row["订单编号"] == order_no:
            return row
    return None

# 将日期时间格式化为字符串，可指定分隔符，默认为 "-"
def format_excel_time(datetime, separator='-'):
    yy = str(datetime.year)
    mm = '0{0}'.format(datetime.month) if datetime.month < 10 else str(datetime.month)
    dd = '0{0}'.format(datetime.day) if datetime.day < 10 else str(datetime.day)
    date_string = separator.join([yy, mm, dd])
    return date_string
