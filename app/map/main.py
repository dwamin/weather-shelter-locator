import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 리액트(3000번 포트)에서 접속 가능하게 허용합니다.

# 1. DB 접속 설정
DB_CONFIG = {
    "host": "team4-db.postgres.database.azure.com",
    "database": "postgres",
    "user": "azure_root",
    "password": "qwer1234!",
    "port": "5432",
    "sslmode": "require",
}

def get_shelter_data_from_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        # DB에서 데이터 가져오기 (컬럼명 확인 필수!)
        query = """
            SELECT shelter_name, road_addr, lat, lon FROM heat_shelter
            UNION ALL
            SELECT shelter_name, road_addr, lat, lon FROM cold_shelter
        """
        cur.execute(query)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        # 리액트가 이해하기 쉬운 JSON 형태로 가공
        result = []
        for r in rows:
            result.append({
                "name": r[0],
                "addr": r[1],
                "lat": float(r[2]),
                "lng": float(r[3])
            })
        return result
    except Exception as e:
        print(f"❌ DB 에러: {e}")
        return []

# 2. 리액트에서 호출할 API 경로 생성
@app.route('/api/shelters', methods=['GET'])
def get_shelters():
    data = get_shelter_data_from_db()
    return jsonify(data)

if __name__ == "__main__":
    # Flask 서버를 3000번 포트에서 실행합니다.
    app.run(host="0.0.0.0", port=3000, debug=True)